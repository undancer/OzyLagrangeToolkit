import React from "react";

interface TabProps {
  label: string;
  value: number;
  selected: boolean;
  onChange: (value: number) => void;
}

export function Tab({ label, value, selected, onChange }: TabProps) {
  return (
    <button
      className={`px-4 py-2 font-medium border-b-2 ${selected ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
      onClick={() => onChange(value)}
    >
      {label}
    </button>
  );
}

interface TabsProps {
  value: number;
  onChange: (value: number) => void;
  children: React.ReactNode;
}

export function Tabs({ value, onChange, children }: TabsProps) {
  // 为每个Tab子组件添加selected和onChange属性
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        selected: child.props.value === value,
        onChange,
      });
    }
    return child;
  });

  return (
    <div className="flex border-b border-gray-200">{enhancedChildren}</div>
  );
}

interface TabPanelProps {
  value: number;
  index: number;
  children: React.ReactNode;
}

export function TabPanel({
  value,
  index,
  children,
}: TabPanelProps): React.JSX.Element {
  return (
    <div hidden={value !== index} className="py-4">
      {value === index && children}
    </div>
  );
}