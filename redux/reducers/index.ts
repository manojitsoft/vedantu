import { CHANGE_LEVEL, UPDATE_SCORE, REFRESH_AGAIN } from "../action";

export interface CustomAppState {
    level: number | 1;
    score: number | 0;
    isRefreshed: boolean | false;
}

const initialState: CustomAppState = {
    level:2,
    score: 0,
    isRefreshed: false
}

export default (state = initialState, action: any) => {
    switch (action.type) {
        case CHANGE_LEVEL:
            state.level += 1;
            return { ...state } ;
        case UPDATE_SCORE:
            state.score += action.payload.score;
            return { ...state } ;
        case REFRESH_AGAIN:
            state.isRefreshed = !state.isRefreshed;
            return { ...state } ;
        default:
            return { ...state } ;
    }
}