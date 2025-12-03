import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ListFilter, TrendingUp, Clock, Users } from 'lucide-react'
import { useState } from 'react'

const FeedFilter = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState('recent')

  const filters = [
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'following', label: 'Following', icon: Users },
  ]

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId)
    onFilterChange?.(filterId)
  }

  return (
    <Card className="p-3 bg-card border shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
          <ListFilter className="h-4 w-4" />
          <span className="font-medium whitespace-nowrap">Sort by:</span>
        </div>
        
        <div className="flex gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon
            return (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleFilterClick(filter.id)}
                className={`gap-2 whitespace-nowrap ${
                  activeFilter === filter.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                {filter.label}
              </Button>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

export default FeedFilter