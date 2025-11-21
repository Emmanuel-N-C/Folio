import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ size = 'default' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
    </div>
  )
}

export default LoadingSpinner