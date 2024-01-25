import {SZDictionary} from "./JSonDictionary";

const {ccclass, property} = cc._decorator
@ccclass('Element')
export class Element
{
    @property()
    id: string = ""
    @property()
    num: number = 0;
}

@ccclass
export class JSonDictionaryComponent extends cc.Component
{
    @property(
        {
            type: SZDictionary,
            serializable: true
        }
    )
    dic: SZDictionary<Element> = SZDictionary.create<Element>();

    @property()
    id: string = ""
    @property(Element)
    comp: Element = new Element();

    @property(
        {
            visible()
            {
                return this.id && this.comp
            }
        }
    )
    get button() { return false; }
    set button(value) { if(value) this.add() }

    add() 
    {
        this.dic.add(this.id, this.comp);
        this.reset_input()
    }

    reset_input()
    {
        this.id = ""
        this.comp = null
    }

    @property(
        {
        }
    )
    get log() { return false; }
    set log(value) { if(value) Editor.log(this.dic, "") }
}

