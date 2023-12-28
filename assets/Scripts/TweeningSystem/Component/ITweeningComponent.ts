import {TSEditorManager} from "../Editor/Root/TSEditorManager";
import {TSInformator} from "../Helper/TSInformator";

export interface ITweeningComponent
{
    information: TSInformator;
    editor: TSEditorManager;
}
