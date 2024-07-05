import { links } from './data'

export type SectionName = (typeof links)[number]['name']

declare module 'framer-motion' {
  export interface HTMLMotionProps<T> extends React.HTMLAttributes<T> {
    className?: string
  }
}
