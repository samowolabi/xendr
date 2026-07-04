import { ApiPlaygroundShowcase } from '@/components/widget/ApiPlaygroundShowcase'
import './Landing.css'

/**
 * A design-tool style playground: a dot-grid canvas holding the live
 * `ApiPlayground` on the left, and an inspector that drives its props on the
 * right. Chrome is fixed light; the widget defaults to dark.
 */
function Landing() {
  return <ApiPlaygroundShowcase />
}

export default Landing
