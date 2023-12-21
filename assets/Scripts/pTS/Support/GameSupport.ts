
/**
 * @des A class contain many helpful functions that help you lazier to code.
 * @des game_support need to import many other things so this only work with cocos creator game.
 *
 * @author pTSern
 */
export const game_support =
{
    editor:
    {
        refresh_editor(dir: string)
        {
            Editor.assetdb.refresh(dir)
        }
    }
}
