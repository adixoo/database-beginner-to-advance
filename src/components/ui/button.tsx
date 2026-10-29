import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { Slot } from 'radix-ui';

// shadcn/ui Button restyled for Pastel Noir: pill shape, flat fills, no shadows,
// hover raises contrast, the site's mint focus outline. Colours come from the
// shadcn roles mapped onto the design tokens in src/styles/global.css.
const buttonVariants = cva(
	"group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,color,scale] duration-150 outline-none select-none focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-ring active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:text-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-foreground',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-accent',
				ghost: 'text-ink-soft hover:bg-accent hover:text-foreground',
				destructive: 'bg-destructive/14 text-destructive hover:bg-destructive/24',
				link: 'text-primary decoration-[0.07em] underline-offset-[0.2em] hover:underline',
			},
			size: {
				default: 'h-11 px-5 text-base',
				sm: 'h-9 px-3.5 text-sm',
				lg: 'min-h-14 px-7 text-lg',
				icon: 'size-11',
				'icon-sm': 'size-9',
				'icon-lg': 'size-14',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

function Button({
	className,
	variant = 'default',
	size = 'default',
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : 'button';

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
