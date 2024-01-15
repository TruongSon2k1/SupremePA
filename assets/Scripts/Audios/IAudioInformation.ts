
export interface IAudioInformation
{
    id: string;
    audio: cc.AudioClip;
}

export interface IAudioPlayerInformation extends IAudioInformation
{

    volume: number;
}


