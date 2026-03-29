interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FloatingLabelInput = ({
  label,
  name,
  value,
  onChange,
  ...props
}: FloatingLabelInputProps) => (
  <label className="relative block w-full">
    <input
      placeholder=" "
      name={name}
      value={value}
      {...props}
      onChange={onChange}
      className="peer w-full p-[0.9em] !text-[0.8em] rounded-[10px] bg-transparent text-black dark:text-white outline outline-1 outline-black/20 dark:outline-white/10 focus:outline-2 focus:outline-[#4270d1] transition-all"
    />
    <span
      className="absolute top-[0.55em] left-[0.5em] px-[0.5em] bg-white dark:bg-[#1f1f1f] text-gray-500 transition-all pointer-events-none 
      peer-focus:-top-[0.7em] peer-focus:text-[0.55em] peer-focus:text-[#4270d1] 
      peer-[:not(:placeholder-shown)]:-top-[0.7em] peer-[:not(:placeholder-shown)]:text-[0.55em]"
    >
      {label}
    </span>
  </label>
);
