import { CastMember, idCastMember } from "creature";
import { createContext, useContext, useRef, useState } from "react";
import { CastMemberContext } from "../app/store/castMembers";
import { Dialog, DialogButton } from "./Dialog";

export interface TargetSelectAPI {
  open: (
    multiple: boolean,
    onSelect: (castMembers: CastMember[]) => void
  ) => void;
}

export const TargetSelectContext = createContext<TargetSelectAPI>({
  open: () => {},
});

export function useTargetSelect(): {
  jsx: React.ReactNode;
  context: TargetSelectAPI;
} {
  const [open, setOpen] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [onSelect, setOnSelect] = useState<{
    fn: (castMembers: CastMember[]) => void;
  }>({ fn: () => {} });

  const jsx = open && (
    <TargetSelect
      multiple={multiple}
      onSelect={onSelect.fn}
      onClose={() => {
        setOpen(false);
      }}
    />
  );

  const context: TargetSelectAPI = {
    open: (
      multiple: boolean,
      onSelect: (castMembers: CastMember[]) => void
    ) => {
      setMultiple(multiple);
      setOnSelect({
        fn: (castMembers: CastMember[]) => {
          setOpen(false);
          onSelect(castMembers);
        },
      });
      setOpen(true);
    },
  };

  return { jsx, context };
}

export function TargetSelect({
  multiple = false,
  onSelect,
  onClose,
}: {
  multiple: boolean;
  onSelect: (castMembers: CastMember[]) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLSelectElement | null>(null);
  const castMembers = useContext(CastMemberContext);

  const submit = () => {
    const select = ref.current;
    if (!select) {
      return;
    }
    const selected = Array.from(select.selectedOptions)
      .map(({ value: id }) =>
        castMembers.find((castMember) => castMember.id === id)
      )
      .filter((castMember) => castMember !== undefined) as CastMember[];
    onSelect(selected);
  };
  const options = castMembers.map((castMember) => (
    <option key={castMember.id} value={castMember.id}>
      {idCastMember(castMember)}
    </option>
  ));
  const title = `Select target${multiple ? "s" : ""}`;
  const buttons = (
    <>
      <DialogButton onClick={submit}>Select</DialogButton>
    </>
  );
  return (
    <Dialog title={title} buttons={buttons} onClose={onClose}>
      <select multiple={multiple} ref={ref}>
        {options}
      </select>
    </Dialog>
  );
}
