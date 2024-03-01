import { FC } from 'react';
import { IAssetItem } from '../../../api';
import { useNitroBundle } from '../../../hooks';
import { Flex } from '../../../layout';
import { TextureEditorItemComponent } from './TextureEditorItemComponent';

export const TextureEditorListComponent: FC<{}> = props =>
{
    const { assets = null } = useNitroBundle();

    const assetSorter = (a: IAssetItem, b: IAssetItem) =>
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
        // If all properties are equal, maintain the original order
        return 0;
    }

    if(!assets) return null;
    
    return (
        <Flex
            column
            className="gap-2">
            { assets.sort(assetSorter).map((asset, index) =>
            {
                return <TextureEditorItemComponent key={ index } textureAssetIndex={ index } />
            }) }
        </Flex>
    )
}
