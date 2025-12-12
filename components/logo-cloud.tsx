import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";

type Logo = {
	src: string;
	alt: string;
};

export function LogoCloud() {
	return (
		<div className="grid grid-cols-2 border md:grid-cols-4">
			<LogoCard
				className="relative border-r border-b bg-secondary dark:bg-secondary/30"
				logo={{
					src: "https://storage.efferd.com/logo/nvidia.svg",
					alt: "Nvidia Logo",
				}}
			>
				<PlusIcon
					className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6"
					strokeWidth={1}
				/>
			</LogoCard>

			<LogoCard
				className="border-b md:border-r"
				logo={{
					src: "https://storage.efferd.com/logo/supabase.svg",
					alt: "Supabase Logo",
				}}
			/>

			<LogoCard
				className="relative border-r border-b md:bg-secondary dark:md:bg-secondary/30"
				logo={{
					src: "https://storage.efferd.com/logo/github.svg",
					alt: "GitHub Logo",
				}}
			>
				<PlusIcon
					className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6"
					strokeWidth={1}
				/>
				<PlusIcon
					className="-bottom-[12.5px] -left-[12.5px] absolute z-10 hidden size-6 md:block"
					strokeWidth={1}
				/>
			</LogoCard>

			<LogoCard
				className="relative border-b bg-secondary md:bg-background dark:bg-secondary/30 md:dark:bg-background"
				logo={{
					src: "https://storage.efferd.com/logo/openai.svg",
					alt: "OpenAI Logo",
				}}
			/>

			<LogoCard
				className="relative border-r border-b bg-secondary md:border-b-0 md:bg-background dark:bg-secondary/30 md:dark:bg-background"
				logo={{
					src: "https://storage.efferd.com/logo/turso.svg",
					alt: "Turso Logo",
				}}
			>
				<PlusIcon
					className="-right-[12.5px] -bottom-[12.5px] md:-left-[12.5px] absolute z-10 size-6 md:hidden"
					strokeWidth={1}
				/>
			</LogoCard>

			<LogoCard
				className="border-b bg-background md:border-r md:border-b-0 md:bg-secondary dark:md:bg-secondary/30"
				logo={{
					src: "https://storage.efferd.com/logo/clerk.svg",
					alt: "Clerk Logo",
				}}
			/>

			<LogoCard
				className="border-r"
				logo={{
					src: "https://storage.efferd.com/logo/claude.svg",
					alt: "Claude AI Logo",
				}}
			/>

			<LogoCard
				className="bg-secondary dark:bg-secondary/30"
				logo={{
					src: "https://efferd.com/logos/vercel.svg",
					alt: "Vercel Logo",
				}}
			/>
		</div>
	);
}

type LogoCardProps = React.ComponentProps<"div"> & {
	logo: Logo;
};

function LogoCard({ logo, className, children, ...props }: LogoCardProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-center bg-background px-4 py-8 md:p-8",
				className
			)}
			{...props}
		>
			<img
				alt={logo.alt}
				className="pointer-events-none h-4 select-none md:h-5 dark:brightness-0 dark:invert"
				height="auto"
				src={logo.src}
				width="auto"
			/>
			{children}
		</div>
	);
}
