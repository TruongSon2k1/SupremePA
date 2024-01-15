import {BaseCCClass} from "../CC_pTS/ExpertComponent/BaseCCClass";
import {str} from "../pTS/Support/STRING";
import {IAudioInformation} from "./IAudioInformation";

const {ccclass, property} = cc._decorator;

@ccclass('AudioInformation')
export class AudioInformation extends BaseCCClass implements IAudioInformation
{
    static create(audio: IAudioInformation): AudioInformation
    {
        const ret = new AudioInformation();
        ret.id = audio.id;
        ret.audio = audio.audio;

        return ret;
    }

    static empty(): AudioInformation
    {
        const ret = new AudioInformation();
        ret.id = str.uuid("AU", "X")
        ret.audio = null;

        return ret;
    }

    @property()
    id: string = str.uuid("AU", "X");

    @property(cc.AudioClip)
    audio: cc.AudioClip = null;

    is_valid()
    {
        return !!this.audio && !!this.id;
    }

    reuuid() { this.id = str.uuid("AU", "B") }

    is_equal(audio: IAudioInformation)
    {
        if(this.id === audio.id) this.reuuid();
        return this.audio === audio.audio;
    }

    play(volume: number = 1): number 
    {
        return cc.audioEngine.play(this.audio, false, volume); 
    }

    private constructor() { super(); }
}
