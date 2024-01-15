import {AudioFinder} from "../../Audios/AudioManager";
import {FastComponent} from "../Root/FastComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export class FCAudioPlay extends FastComponent
{
    @property(AudioFinder)
    audio: AudioFinder = new AudioFinder();

    protected get time_cost(): number 
    {
        return 0;
    }


    protected _mechanic(): void 
    {
        if (this.audio) this.audio.play();
    }


}
