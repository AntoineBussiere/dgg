type Props = {
    title: string;
    description?: string;
};

export default function PageTitle({
    title,
    description,
}: Props) {
    return (
        <div className="mb-8">
            <h1 className="
                text-3xl
                font-bold
                text-white
            ">
                {title}
            </h1>

            {description && (
                <p className="
                    mt-2
                    text-slate-300
                ">
                    {description}
                </p>
            )}
        </div>
    );
}