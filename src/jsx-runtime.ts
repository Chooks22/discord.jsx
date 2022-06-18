import { arrayify } from './_utils.js'

function jsx<T>(ctor: (props: T) => unknown, props: T): unknown {
  return ctor(props)
}

function fragment<T>(props: { children: T | T[] }): T[] {
  return arrayify(props.children)
}

export { jsx, jsx as jsxs, fragment as Fragment }
