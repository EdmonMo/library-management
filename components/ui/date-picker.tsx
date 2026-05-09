import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  placeholder?: string
  dateFormat?: string
  disabled?: boolean
}

export function DatePicker<T extends FieldValues>({
  name,
  control,
  placeholder = "Pick a date",
  dateFormat = "dd/MM/yyyy",
  disabled,
}: DatePickerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                disabled={disabled}
                data-empty={!field.value}
                className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
              />
            }
          >
            <CalendarIcon />
            {field.value ? (
              format(new Date(field.value), dateFormat)
            ) : (
              <span>{placeholder}</span>
            )}
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              selected={field.value ? new Date(field.value) : undefined}
              mode="single"
              classNames={{
                month_caption: "text-sm font-semibold text-primary px-2",
                nav: "flex items-center gap-1",
                button_previous: "hover:bg-muted rounded-md p-1",
                button_next: "hover:bg-muted rounded-md p-1",
                day: "h-9 w-9 text-sm rounded-md hover:bg-muted aria-selected:hover:bg-primary",
                selected:
                  "bg-primary text-primary-foreground rounded-md hover:bg-primary hover:text-primary-foreground",
                day_button: "h-full w-full flex items-center justify-center",
                today: "font-bold text-primary underline",
                outside: "text-muted-foreground opacity-40",
                disabled: "opacity-30 cursor-not-allowed",
              }}
              className="rounded-lg border"
              onSelect={field.onChange}
            />
          </PopoverContent>
        </Popover>
      )}
    />
  )
}
