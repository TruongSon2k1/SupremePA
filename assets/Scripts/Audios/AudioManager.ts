import {AntiDuplicateLevel, BaseMasterComponent} from "../CC_pTS/ExpertComponent/BaseMasterComponent";
import {AudioInformation} from "./AudioInformation";

const {ccclass, property, executeInEditMode, playOnFocus} = cc._decorator;


@ccclass('AudioFinder')
export class AudioFinder
{
    @property()
    _valid_: boolean = false;
    @property(
        {
            type: [cc.String],
            visible(){ return !this._valid_; },
        }
    )
    get list() { return am.get_str_list() }

    @property()
    _search_: string = ""
    @property()
    get search() { this.__do_search(); return this._search_ }
    set search(value: string) 
    {
        this._search_ = value
    }

    __do_search()
    {
        if(!!this.list.find(v=>this._search_===v)) this._valid_ = true;
        else this._valid_ = false;
    }

    @property({ min: 0, visible() { return this._valid_ }})
    volume: number = 1;

    play()
    {
        if(!this._valid_) return;
        am.play(this._search_, this.volume)
    }
} 


@ccclass
@executeInEditMode
@playOnFocus
class AudioManager extends BaseMasterComponent
{
    protected anti_duplicate: AntiDuplicateLevel = AntiDuplicateLevel.SINGLETON;

    protected init(): void 
    {
        am = this; 
    }

    @property(
        {
            type: [AudioInformation],
        }
    )
    audios: AudioInformation[] = []
    
    get_audio(id: string): AudioInformation
    {
        return this.audios.find( v => v.id === id );
    }

    get_str_list()
    {
        return this.audios.map(v=>v.id)
    }

    play(id: string, volume: number = 1)
    {
        this.get_audio(id).play(volume);
    }
}

export let am: Readonly<AudioManager> = null;




























