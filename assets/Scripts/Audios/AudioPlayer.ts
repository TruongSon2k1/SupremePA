import {BaseCCClass} from "../CC_pTS/ExpertComponent/BaseCCClass";
import {AudioInformation} from "./AudioInformation";
import {IAudioInformation, IAudioPlayerInformation} from "./IAudioInformation";

const {ccclass, property} = cc._decorator;

@ccclass('AudioPlayer')
export class AudioPlayer extends BaseCCClass implements IAudioPlayerInformation
{
    public static create(audio: cc.AudioClip)
    {
        const ret = new AudioPlayer()         
        ret.audio = audio
        return ret;
    }

    @property({ visible: false })
    id: string = "";

    @property({ visible: false })
    audio: cc.AudioClip = null;

    @property({ min: 0 })
    volume: number = 1;

    play()
    {
        this.log("ASKLJFKLASJFASKL")
    }
}
