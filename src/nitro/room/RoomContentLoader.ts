import { Spritesheet, Texture } from 'pixi.js';
import { FurnitureType, GetAssetManager, GraphicAssetCollection, IAssetData, IFurnitureData, IGraphicAssetCollection, IPetColorResult, IRoomContentLoader, IRoomObject, ISessionDataManager, ISpritesheetData, RoomObjectCategory, RoomObjectUserType, RoomObjectVariable, RoomObjectVisualizationType } from '../../api';
import { PetColorResult } from './PetColorResult';

export class RoomContentLoader implements IRoomContentLoader
{
    private static PLACE_HOLDER: string = 'place_holder';
    private static PLACE_HOLDER_WALL: string = 'place_holder_wall';
    private static PLACE_HOLDER_PET: string = 'place_holder_pet';
    private static PLACE_HOLDER_DEFAULT: string = RoomContentLoader.PLACE_HOLDER;
    private static ROOM: string = 'room';
    private static TILE_CURSOR: string = 'tile_cursor';
    private static SELECTION_ARROW: string = 'selection_arrow';

    public static MANDATORY_LIBRARIES: string[] = [ RoomContentLoader.PLACE_HOLDER, RoomContentLoader.PLACE_HOLDER_WALL, RoomContentLoader.PLACE_HOLDER_PET, RoomContentLoader.ROOM, RoomContentLoader.TILE_CURSOR, RoomContentLoader.SELECTION_ARROW ];

    private _sessionDataManager: ISessionDataManager;

    private _activeObjects: { [index: string]: number } = {};
    private _activeObjectTypes: Map<number, string> = new Map();
    private _activeObjectTypeIds: Map<string, number> = new Map();
    private _objectTypeAdUrls: Map<string, string> = new Map();
    private _wallItems: { [index: string]: number } = {};
    private _wallItemTypes: Map<number, string> = new Map();
    private _wallItemTypeIds: Map<string, number> = new Map();
    private _furniRevisions: Map<string, number> = new Map();
    private _pets: { [index: string]: number } = {};
    private _petColors: Map<number, Map<number, IPetColorResult>> = new Map();
    private _objectAliases: Map<string, string> = new Map();
    private _objectOriginalNames: Map<string, string> = new Map();

    private _pendingContentTypes: string[] = [];
    private _dataInitialized: boolean = false;

    constructor(sessionDataManager: ISessionDataManager)
    {
        this._sessionDataManager = sessionDataManager;
    }

    public async init(): Promise<void>
    {
        this.processFurnitureData(this._sessionDataManager.getAllFurnitureData());

        //for(const [ index, name ] of NitroConfiguration.getValue<string[]>('pet.types').entries()) this._pets[name] = index;
    }

    public processFurnitureData(furnitureData: IFurnitureData[]): void
    {
        if(!furnitureData) return;

        for(const furniture of furnitureData)
        {
            if(!furniture) continue;

            const id = furniture.id;

            let className = furniture.className;

            if(furniture.hasIndexedColor) className = ((className + '*') + furniture.colorIndex);

            const revision = furniture.revision;
            const adUrl = furniture.adUrl;

            if(adUrl && adUrl.length > 0) this._objectTypeAdUrls.set(className, adUrl);

            let name = furniture.className;

            if(furniture.type === FurnitureType.FLOOR)
            {
                this._activeObjectTypes.set(id, className);
                this._activeObjectTypeIds.set(className, id);

                if(!this._activeObjects[name]) this._activeObjects[name] = 1;
            }

            else if(furniture.type === FurnitureType.WALL)
            {
                if(name === 'post.it')
                {
                    className = 'post_it';
                    name = 'post_it';
                }

                if(name === 'post.it.vd')
                {
                    className = 'post_it_vd';
                    name = 'post_id_vd';
                }

                this._wallItemTypes.set(id, className);
                this._wallItemTypeIds.set(className, id);

                if(!this._wallItems[name]) this._wallItems[name] = 1;
            }

            const existingRevision = this._furniRevisions.get(name);

            if(revision > existingRevision)
            {
                this._furniRevisions.delete(name);
                this._furniRevisions.set(name, revision);
            }
        }
    }

    public getFurnitureFloorNameForTypeId(typeId: number): string
    {
        const type = this._activeObjectTypes.get(typeId);

        return this.removeColorIndex(type);
    }

    public getFurnitureWallNameForTypeId(typeId: number, extra: string = null): string
    {
        let type = this._wallItemTypes.get(typeId);

        if((type === 'poster') && (extra !== null)) type = (type + extra);

        return this.removeColorIndex(type);
    }

    public getFurnitureFloorColorIndex(typeId: number): number
    {
        const type = this._activeObjectTypes.get(typeId);

        if(!type) return -1;

        return this.getColorIndexFromName(type);
    }

    public getFurnitureWallColorIndex(typeId: number): number
    {
        const type = this._wallItemTypes.get(typeId);

        if(!type) return -1;

        return this.getColorIndexFromName(type);
    }

    private getColorIndexFromName(name: string): number
    {
        if(!name) return -1;

        const index = name.indexOf('*');

        if(index === -1) return 0;

        return parseInt(name.substr(index + 1));
    }

    private removeColorIndex(name: string): string
    {
        if(!name) return null;

        const index = name.indexOf('*');

        if(index === -1) return name;

        return name.substr(0, index);
    }

    public getRoomObjectAdUrl(type: string): string
    {
        const value = this._objectTypeAdUrls.get(type);

        if(!value) return '';

        return value;
    }

    public getPetColorResult(petIndex: number, paletteIndex: number): IPetColorResult
    {
        const colorResults = this._petColors.get(petIndex);

        if(!colorResults) return null;

        return colorResults.get(paletteIndex);
    }

    public getPetColorResultsForTag(petIndex: number, tagName: string): IPetColorResult[]
    {
        const colorResults = this._petColors.get(petIndex);
        const results: IPetColorResult[] = [];

        if(colorResults)
        {
            for(const result of colorResults.values())
            {
                if(result.tag === tagName) results.push(result);
            }
        }

        return results;
    }

    public getCollection(name: string): IGraphicAssetCollection
    {
        if(!name) return null;

        return GetAssetManager().getCollection(name);
    }

    public getImage(name: string): Texture
    {
        return GetAssetManager().getImage(name);
    }

    public addAssetToCollection(collectionName: string, assetName: string, texture: Texture, override: boolean = true): boolean
    {
        const collection = this.getCollection(collectionName);

        if(!collection) return false;

        return collection.addAsset(assetName, texture, override, 0, 0, false, false);
    }

    public createCollection(data: IAssetData, spritesheet: Spritesheet): GraphicAssetCollection
    {
        const collection = GetAssetManager().createCollection(data, spritesheet);

        if(!collection) return null;

        const petIndex = this._pets[collection.name];

        if(petIndex !== undefined)
        {
            const keys = collection.getPaletteNames();
            const palettes: Map<number, IPetColorResult> = new Map();

            for(const key of keys)
            {
                const palette = collection.getPalette(key);
                const paletteData = data.palettes[key];

                const primaryColor = palette.primaryColor;
                const secondaryColor = palette.secondaryColor;
                const breed = ((paletteData.breed !== undefined) ? paletteData.breed : 0);
                const tag = ((paletteData.colorTag !== undefined) ? paletteData.colorTag : -1);
                const master = ((paletteData.master !== undefined) ? paletteData.master : false);
                const layerTags = ((paletteData.tags !== undefined) ? paletteData.tags : []);

                palettes.set(parseInt(key), new PetColorResult(primaryColor, secondaryColor, breed, tag, key, master, layerTags));
            }

            this._petColors.set(petIndex, palettes);
        }
    }

    public getPlaceholderName(type: string): string
    {
        const category = this.getCategoryForType(type);

        switch(category)
        {
            case RoomObjectCategory.FLOOR:
                return RoomContentLoader.PLACE_HOLDER;
            case RoomObjectCategory.WALL:
                return RoomContentLoader.PLACE_HOLDER_WALL;
            default:
                if(this._pets[type] !== undefined) return RoomContentLoader.PLACE_HOLDER_PET;

                return RoomContentLoader.PLACE_HOLDER_DEFAULT;
        }
    }

    public getCategoryForType(type: string): number
    {
        if(!type) return RoomObjectCategory.MINIMUM;

        if(this._activeObjects[type] !== undefined) return RoomObjectCategory.FLOOR;

        if(this._wallItems[type] !== undefined) return RoomObjectCategory.WALL;

        if(this._pets[type] !== undefined) return RoomObjectCategory.UNIT;

        if(type.indexOf('poster') === 0) return RoomObjectCategory.WALL;

        if(type === 'room') return RoomObjectCategory.ROOM;

        if(type === RoomObjectUserType.USER) return RoomObjectCategory.UNIT;

        if(type === RoomObjectUserType.PET) return RoomObjectCategory.UNIT;

        if(type === RoomObjectUserType.BOT) return RoomObjectCategory.UNIT;

        if(type === RoomObjectUserType.RENTABLE_BOT) return RoomObjectCategory.UNIT;

        if((type === RoomContentLoader.TILE_CURSOR) || (type === RoomContentLoader.SELECTION_ARROW)) return RoomObjectCategory.CURSOR;

        return RoomObjectCategory.MINIMUM;
    }

    public getPetNameForType(type: number): string
    {
        return window.NitroBuilderConfig['pet.types'][type] || null;
    }

    public isLoaderType(type: string): boolean
    {
        type = RoomObjectUserType.getRealType(type);

        if(type === RoomObjectVisualizationType.USER) return false;

        return true;
    }

    public async processAsset(texture: Texture, data: IAssetData): Promise<void>
    {
        let spritesheet: Spritesheet<ISpritesheetData> = null;

        if(texture && data?.spritesheet && Object.keys(data.spritesheet).length)
        {
            spritesheet = new Spritesheet(texture, data.spritesheet);

            await spritesheet.parse();
        }

        this.createCollection(data, spritesheet);
    }

    public setAssetAliasName(name: string, originalName: string): void
    {
        this._objectAliases.set(name, originalName);
        this._objectOriginalNames.set(originalName, name);
    }

    private getAssetAliasName(name: string): string
    {
        const existing = this._objectAliases.get(name);

        if(!existing) return name;

        return existing;
    }

    private getAssetOriginalName(name: string): string
    {
        const existing = this._objectOriginalNames.get(name);

        if(!existing) return name;

        return existing;
    }

    public setRoomObjectRoomId(object: IRoomObject, roomId: string): void
    {
        const model = object && object.model;

        if(!model) return;

        model.setValue(RoomObjectVariable.OBJECT_ROOM_ID, roomId);
    }
}
