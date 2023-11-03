declare global{
    interface Element {
        get allAttributes(): Object

        setStyles(styles: Object): void

        changeVisibility(isVisible: Boolean): void

    }
}
