
export const ccsp = 
{
    tween:
    {
        get_target_from_tween<T>(tween: cc.Tween<T>): T
        {
            //@ts-ignore
            return tween.set()._target;
        }
    }

}
