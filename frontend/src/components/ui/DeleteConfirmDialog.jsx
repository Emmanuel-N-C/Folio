import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AlertTriangle } from 'lucide-react'

/**
 * Reusable delete confirmation dialog
 * @param {boolean} open - Whether dialog is open
 * @param {function} onOpenChange - Callback when dialog open state changes
 * @param {function} onConfirm - Callback when delete is confirmed
 * @param {string} title - Dialog title
 * @param {string} description - Warning description
 * @param {string} itemName - Name of item being deleted (optional)
 * @param {boolean} isDeleting - Whether delete operation is in progress
 */
export function DeleteConfirmDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  title = "Are you sure?",
  description = "This action cannot be undone.",
  itemName,
  isDeleting = false
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="pt-2 space-y-2">
              <p>{description}</p>
              {itemName && (
                <p className="p-2 bg-destructive/10 rounded text-sm font-medium text-destructive break-words">
                  {itemName}
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}