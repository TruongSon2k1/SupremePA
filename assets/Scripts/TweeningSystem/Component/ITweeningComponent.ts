import {IJSonObject} from "../../CC_pTS/Interface/IJSONData";
import {ConditionType, EditorMode, ExecutionMode, ExecutionType, ResetType, RuntimeType, ViewMode} from "../Helper/TSEnum";


export interface ITSMechanic extends IJSonObject
{
    optional?: IJSonObject;

    active: boolean;
    bounding_targets: cc.Node[];
    name: string;
}

export interface ITSCondition extends IJSonObject
{
    optional?: IJSonObject;
    runtime_type: RuntimeType;
    execution_type: ExecutionType;
    name: string;
}

export interface ITSEdtiorObject 
{
    view_mode: ViewMode;
}

export interface ITSConditionPreviewObject extends IJSonObject
{
    action: ITSCondition;
    index: number;
}

export interface ITSMechanicPreviewObject extends IJSonObject
{
    action: ITSMechanic;
    index: number;
}

export interface ITSConditionEditor extends ITSEdtiorObject
{
    list: ITSConditionPreviewObject[]

    init_with_data(data: ITSConditionEditor): void;
}

export interface ITSMechanicEditor extends ITSEdtiorObject
{
    list: ITSMechanicPreviewObject[]
    init_with_data(data: ITSMechanicEditor): void;
}

export interface ITSInformator extends IJSonObject
{
    details: string;
    main: cc.Node;

    silent_backend: boolean;

    conditon_type: ConditionType;

    reset_type: ResetType;

    mechanic_execution_mode: ExecutionMode;
}

export interface ITSEditorManager extends IJSonObject
{
    editor_mode: EditorMode;

    condition: ITSConditionEditor;

    mechanic: ITSMechanicEditor;
}

export interface ITweeningComponent extends IJSonObject
{
    information: ITSInformator;
    editor: ITSEditorManager;
}

