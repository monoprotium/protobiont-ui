// loose *.vue shim so tsgo resolves .vue re-exports; real SFC types are vue-tsc's job
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<{}, {}, any>
  export default component
}
