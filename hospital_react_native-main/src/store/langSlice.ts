export type LangInfo = {
    lang: string;
    changeLang: (value) => void;
};

const langSlice = (set) => ({
    lang: 'zh_CN',
    changeLang: (value) => set((state) => ({ lang: state.lang = value })),
});

export default langSlice;
