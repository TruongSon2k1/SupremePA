"use strict"
const ExecutionType =
{
    NORMAL: 0,
    OVERLOADING: 1
}

const RuntimeType =
{
    NORMAL: 0
}

const ResetType =
{
    THIS: 0,
    ALL: 1
}

const ViewMode =
{
    NONE: 0,
    CONTENTS: 1,
    LISTS: 2,
    BOTH: 3
}

const EditorMode =
{
    NONE: 0,
    CONDITION: 1,
    MECHANIC: 2,
    BOTH: 3
}

const ConditionType =
{
    OR: 0,
    AND: 1
}

const ExecutionMode =
{
    SEQUENCE: 0,
    QUERYING: 1,
}

const df_infor =
{
    details: "A NEW TWEENING COMPONENT",
    main: null,
    silent_backend: true,
    condition_type: ConditionType.OR,
    reset_type: ResetType.THIS,
    mechanic_execution_mode: ExecutionMode.SEQUENCE,
}

const df_editor =
{

}

const default_ts =
{
    information: df_infor,
    editor: null

}

Editor.Panel.extend(
    {
        ts: null,
        style: `
            :host { margin: 5px; }
            .text {
            background: #ffffff; 
            margin-right: auto;
            }

        `,

        template: `
            <div style="margin-bottom: 15px;"></div>
        `,

        $: {
        },

        ready() {
        },

        messages: {
            'ts-data:open'(event) {
            }
        }

    }
)

