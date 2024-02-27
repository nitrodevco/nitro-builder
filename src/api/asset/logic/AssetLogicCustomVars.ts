import { IAssetLogicCustomVars } from './IAssetLogicCustomVars';

export class AssetLogicCustomVars
{
    public variables: string[];

    public static from(data: IAssetLogicCustomVars): AssetLogicCustomVars
    {
        const customVars = new AssetLogicCustomVars();

        if(data.variables != undefined)
        {
            const variables: string[] = [];

            if(Array.isArray(data.variables) && data.variables.length)
            {
                for(const variable of data.variables) variables.push(variable);
            }

            if(variables.length) customVars.variables = variables;
        }

        return customVars;
    }

    public toJSON(): IAssetLogicCustomVars
    {
        const json: IAssetLogicCustomVars = {};

        if(this.variables != undefined)
        {
            json.variables = [];

            this.variables.forEach(variable => json.variables.push(variable));
        }

        return json;
    }
}
