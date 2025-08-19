import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';

interface FieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Text Input Field
interface TextFieldProps<T extends FieldValues> extends FieldProps<T> {
  type?: 'text' | 'email' | 'tel' | 'url' | 'password';
}

export function TextField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  className = ''
}: TextFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "transition-colors",
                form.formState.errors[name] && "border-destructive focus:border-destructive"
              )}
            />
          </FormControl>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Number Input Field with Currency Support
interface NumberFieldProps<T extends FieldValues> extends FieldProps<T> {
  min?: number;
  max?: number;
  step?: number;
  currency?: boolean;
  prefix?: string;
  suffix?: string;
}

export function NumberField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  min,
  max,
  step = 1,
  currency = false,
  prefix,
  suffix,
  required = false,
  disabled = false,
  className = ''
}: NumberFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}>
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {(currency || prefix) && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {currency ? <DollarSign className="h-4 w-4" /> : prefix}
                </div>
              )}
              <Input
                {...field}
                type="number"
                min={min}
                max={max}
                step={step}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  "transition-colors",
                  (currency || prefix) && "pl-10",
                  suffix && "pr-10",
                  form.formState.errors[name] && "border-destructive focus:border-destructive"
                )}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
              />
              {suffix && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                  {suffix}
                </div>
              )}
            </div>
          </FormControl>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Textarea Field
interface TextareaFieldProps<T extends FieldValues> extends FieldProps<T> {
  rows?: number;
  maxLength?: number;
}

export function TextareaField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  rows = 3,
  maxLength,
  required = false,
  disabled = false,
  className = ''
}: TextareaFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}>
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Textarea
                {...field}
                rows={rows}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                className={cn(
                  "resize-none transition-colors",
                  form.formState.errors[name] && "border-destructive focus:border-destructive"
                )}
              />
              {maxLength && (
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  {field.value?.length || 0}/{maxLength}
                </div>
              )}
            </div>
          </FormControl>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Select Field
interface SelectFieldProps<T extends FieldValues> extends FieldProps<T> {
  options: { value: string; label: string; disabled?: boolean }[];
}

export function SelectField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder = "Select an option",
  options,
  required = false,
  disabled = false,
  className = ''
}: SelectFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}>
            {label}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
            <FormControl>
              <SelectTrigger className={cn(
                "transition-colors",
                form.formState.errors[name] && "border-destructive focus:border-destructive"
              )}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Checkbox Field
interface CheckboxFieldProps<T extends FieldValues> extends Omit<FieldProps<T>, 'placeholder'> {
  text: string;
}

export function CheckboxField<T extends FieldValues>({
  form,
  name,
  label,
  text,
  description,
  required = false,
  disabled = false,
  className = ''
}: CheckboxFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-start space-x-3 space-y-0", className)}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={cn(
                "transition-colors",
                form.formState.errors[name] && "border-destructive"
              )}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              required && "after:content-['*'] after:ml-0.5 after:text-destructive"
            )}>
              {text}
            </FormLabel>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

// Radio Group Field
interface RadioFieldProps<T extends FieldValues> extends FieldProps<T> {
  options: { value: string; label: string; description?: string }[];
  direction?: 'horizontal' | 'vertical';
}

export function RadioField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  options,
  direction = 'vertical',
  required = false,
  disabled = false,
  className = ''
}: RadioFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}>
            {label}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={cn(
                direction === 'horizontal' ? "flex flex-row space-x-4" : "flex flex-col space-y-2"
              )}
              disabled={disabled}
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <label htmlFor={option.value} className="text-sm font-medium leading-none">
                    {option.label}
                  </label>
                  {option.description && (
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  )}
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Date Picker Field
interface DateFieldProps<T extends FieldValues> extends Omit<FieldProps<T>, 'placeholder'> {
  disabledDates?: (date: Date) => boolean;
  fromDate?: Date;
  toDate?: Date;
}

export function DateField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  disabledDates,
  fromDate,
  toDate,
  required = false,
  disabled = false,
  className = ''
}: DateFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          <FormLabel className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}>
            {label}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                    form.formState.errors[name] && "border-destructive",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={disabled}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={disabledDates}
                fromDate={fromDate}
                toDate={toDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}