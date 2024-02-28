import { FC } from 'react';
import { Asset } from '../../../api';
import { useNitroBundle } from '../../../hooks';
import { Flex } from '../../../layout';
import { AssetEditorItemComponent } from './AssetEditorItemComponent';

export const AssetEditorListComponent: FC<{}> = props =>
{
    const { assetData = null } = useNitroBundle();
    const { assets = null } = assetData;

    const assetSorter = (a: Asset, b: Asset) =>
    {
        if (b.size !== a.size) 
        {
            return b.size - a.size;
        }
        if (a.layerCode !== b.layerCode) 
        {
            return a.layerCode.localeCompare(b.layerCode);
        }
        if (a.direction !== b.direction) 
        {
            return a.direction - b.direction;
        }
        if (a.frameNumber !== b.frameNumber) 
        {
            return a.frameNumber - b.frameNumber;
        }

        return 0;
    }

    if(!assets || !assets.length) return null;
    
    return (
        <Flex
            column
            className="gap-2">
            { assets.sort(assetSorter).map((asset, index) =>
            {
                return <AssetEditorItemComponent key={ index } asset={ asset } />
            }) }
        </Flex>
    )
}
