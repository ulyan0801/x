import {create} from 'zustand'

import langSlice,{LangInfo} from './langSlice'

export const useBoundStore = create<LangInfo>((a) => ({
    ...langSlice(a),
}))