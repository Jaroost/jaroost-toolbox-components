export function createElement(element:string):Element{
    let newElement=document.createElement(element)
    return newElement;
}

export function createSvg(svg:string): Element{
    let parser = new DOMParser();
    return parser.parseFromString(svg, "image/svg+xml").documentElement;
}