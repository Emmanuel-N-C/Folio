import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Clock, ArrowUpDown, TrendingUp, Touchpad, ArrowBigUp } from 'lucide-react'
import { useState, useEffect } from 'react'

const FeedFilter = ({ onFilterChange, activeFilter: parentActiveFilter }) => {
  const [activeFilter, setActiveFilter] = useState(parentActiveFilter || 'new')

  // Sync with parent state if provided
  useEffect(() => {
    if (parentActiveFilter) {
      setActiveFilter(parentActiveFilter)
    }
  }, [parentActiveFilter])

  const filters = [
    { id: 'new', label: 'New', icon: Clock, description: 'Most recent posts' },
    { id: 'old', label: 'Old', icon: ArrowUpDown, description: 'Oldest posts first' },
    { id: 'top', label: 'Top', icon: ArrowBigUp, description: 'Most liked & commented' },
  ]

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId)
    onFilterChange?.(filterId)
  }

  const activeFilterObj = filters.find(f => f.id === activeFilter)
  const ActiveIcon = activeFilterObj?.icon

  return (
    <div className="border-b bg-card">
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">Sort by:</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="gap-2 font-semibold text-sm hover:bg-muted"
            >
              {ActiveIcon && <ActiveIcon className="h-4 w-4" />}
              {activeFilterObj?.label}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {filters.map((filter) => {
              const Icon = filter.icon
              return (
                <DropdownMenuItem
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  className={`gap-3 cursor-pointer ${
                    activeFilter === filter.id ? 'bg-primary/10 text-primary font-semibold' : ''
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{filter.label}</span>
                    <span className="text-xs text-muted-foreground">{filter.description}</span>
                  </div>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default FeedFilter