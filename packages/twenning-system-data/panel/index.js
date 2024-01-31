"use strict"


Editor.Panel.extend(
    {
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

