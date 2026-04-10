"use client";

import * as React from "react";
import { HexColorPicker } from "react-colorful";

import { Input } from "./input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function ColorPicker({ value = "#000000", onChange }: ColorPickerProps) {
  const [color, setColor] = React.useState(value);

  const handleChange = (newColor: string) => {
    setColor(newColor);
    onChange?.(newColor);
  };

  return (
    <Popover>
      <PopoverTrigger
        type="button"
        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-gray-500 bg-grays-900 px-4 hover:bg-grays-900 hover:dark:bg-transparent"
      >
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded border"
            style={{ backgroundColor: color }}
          />
          <span>{color}</span>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] space-y-3 p-3 bg-gray-900">
        <HexColorPicker color={color} onChange={handleChange} />

        <Input
          value={color}
          onChange={(e) => handleChange(e.target.value)}
          className="h-8"
          type="text"
        />
      </PopoverContent>
    </Popover>
  );
}