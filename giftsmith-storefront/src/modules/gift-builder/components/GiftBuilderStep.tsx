import React from 'react';
import { Button, Text, Heading, Container } from '@medusajs/ui';
import Medusa from '../../common/icons/medusa';

interface Option {
  id: string | number;
  [key: string]: any;
}

interface GiftBuilderStepProps<T extends Option> {
  stepNumber: number;
  totalSteps: number;
  title: string;
  description: string;
  options: T[];
  renderOption: (option: T, isSelected: boolean, onSelect: () => void) => React.ReactNode;
  selected: any;
  onSelect: (option: T) => void;
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  getOptionValue?: (option: T) => any;
}

function GiftBuilderStep<T extends Option>({
  stepNumber,
  totalSteps,
  title,
  description,
  options,
  renderOption,
  selected,
  onSelect,
  onBack,
  onNext,
  backLabel = 'Back',
  nextLabel = 'Next',
  nextDisabled = false,
  backDisabled = false,
  getOptionValue = (opt) => opt.handle,
}: GiftBuilderStepProps<T>) {
  return (
    <Container className="bg-white shadow mx-auto p-8 rounded-lg w-full max-w-7xl">
      <div className="flex justify-center items-center gap-2 mb-2">
        <Medusa size={24} />
        <Heading level="h2" className="font-bold text-2xl text-center">
          STEP {stepNumber} OF {totalSteps}
        </Heading>
      </div>
      <Heading level="h3" className="mb-4 text-xl text-center">
        {title}
      </Heading>
      <Text className="mb-8 text-gray-500 text-center">{description}</Text>
      <div className="flex flex-wrap justify-center gap-8">
        {options.map((opt) => {
          const value = getOptionValue(opt);
          const isSelected = Array.isArray(selected)
            ? selected.includes(value)
            : selected === value;
          return renderOption(opt, isSelected, () => onSelect(opt));
        })}
      </div>
      <div className="flex justify-center gap-4 mt-8">
        {onBack && (
          <Button
            variant="secondary"
            onClick={onBack}
            disabled={backDisabled}
            type="button"
          >
            {backLabel}
          </Button>
        )}
        {onNext && (
          <Button
            variant="primary"
            onClick={onNext}
            disabled={nextDisabled}
            type="button"
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </Container>
  );
}

export default GiftBuilderStep; 