import { AssetVisualizationDirection } from './AssetVisualizationDirection';
import { AssetVisualizationLayer } from './AssetVisualizationLayer';
import { IAssetVisualizationData } from './IAssetVisualizationData';
import { AssetVisualizationAnimation } from './animation';
import { AssetVisualizationColor } from './color';
import { AssetVisualizationGesture } from './gestures';
import { AssetVisualizationPosture, IAssetVisualizationPosture } from './postures';

export class AssetVisualization
{
    public size: number;
    public layerCount: number;
    public angle: number;
    public layers: AssetVisualizationLayer[];
    public colors: AssetVisualizationColor[];
    public directions: AssetVisualizationDirection[];
    public animations: AssetVisualizationAnimation[];
    public defaultPosture: string;
    public postures: { defaultPosture?: string, postures?: IAssetVisualizationPosture[] };
    public gestures: AssetVisualizationGesture[];

    public static from(data: IAssetVisualizationData): AssetVisualization
    {
        const visualizationData = new AssetVisualization();

        if(data.size != undefined) visualizationData.size = data.size;
        if(data.layerCount != undefined) visualizationData.layerCount = data.layerCount;
        if(data.angle != undefined) visualizationData.angle = data.angle;

        if(data.layers != undefined)
        {
            const keys = Object.keys(data.layers);

            if(keys.length)
            {
                visualizationData.layers = [];

                for(const key of keys) visualizationData.layers.push(AssetVisualizationLayer.from(key, data.layers[key]));
            }
        }

        if(data.colors != undefined)
        {
            const keys = Object.keys(data.colors);

            if(keys.length)
            {
                visualizationData.colors = [];

                for(const key of keys) visualizationData.colors.push(AssetVisualizationColor.from(key, data.colors[key]));
            }
        }

        if(data.directions != undefined)
        {
            const keys = Object.keys(data.directions);

            if(keys.length)
            {
                visualizationData.directions = [];

                for(const key of keys)
                {
                    visualizationData.directions.push(AssetVisualizationDirection.from(key, data.directions[key]));
                }
            }
        }

        if(data.animations != undefined)
        {
            const keys = Object.keys(data.animations);

            if(keys.length)
            {
                visualizationData.animations = [];

                for(const key of keys)
                {
                    visualizationData.animations.push(AssetVisualizationAnimation.from(key, data.animations[key]));
                }
            }
        }

        if(data.defaultPosture != undefined) visualizationData.defaultPosture = data.defaultPosture;

        if(data.postures != undefined)
        {
            const keys = Object.keys(data.postures);

            if(keys.length)
            {
                visualizationData.postures = {};

                for(const key of keys)
                {
                    visualizationData.postures[key] = AssetVisualizationPosture.from(data.postures[key]);
                }
            }
        }

        if(data.gestures != undefined)
        {
            const keys = Object.keys(data.gestures);

            if(keys.length)
            {
                visualizationData.gestures = [];

                for(const key of keys) visualizationData.gestures.push(AssetVisualizationGesture.from(data.gestures[key]));
            }
        }

        return visualizationData;
    }

    public toJSON(): IAssetVisualizationData
    {
        const json: IAssetVisualizationData = {};

        if(this.size != undefined) json.size = this.size;
        if(this.layerCount != undefined) json.layerCount = this.layerCount;
        if(this.angle != undefined) json.angle = this.angle;

        if(this.layers && this.layers.length)
        {
            json.layers = {};

            this.layers.forEach(layer => json.layers[layer.key] = layer.toJSON());
        }

        if(this.colors && this.colors.length)
        {
            json.colors = {};

            this.colors.forEach(color => json.colors[color.key] = color.toJSON());
        }

        if(this.directions && this.directions.length)
        {
            json.directions = {};

            this.directions.forEach(direction => json.directions[direction.key] = direction.toJSON());
        }

        if(this.animations && this.animations.length)
        {
            json.animations = {};

            this.animations.forEach(animation => json.animations[animation.key] = animation.toJSON());
        }

        if(this.defaultPosture != undefined) json.defaultPosture = this.defaultPosture;
        if(this.postures != undefined) json.postures = this.postures;

        if(this.gestures && this.gestures.length)
        {
            json.gestures = [];

            this.gestures.forEach(gesture => json.gestures.push(gesture.toJSON()));
        }

        return json;
    }
}
