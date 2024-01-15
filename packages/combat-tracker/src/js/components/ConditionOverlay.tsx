import styled from "styled-components";
import { CastMember } from "../data/castMembers";

const Panel = styled.div`
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  width: 100%;
`;
const Condition = styled.div`
  font-size: 3em;
  flex-grow: 1;
`;

const Icons = {
  blinded: "🙈",
  charmed: "😍", // "😵‍💫",
  dead: "💀",
  deafened: "🙉",
  frightened: "😱",
  grappled: "🤼",
  incapacitated: "😵",
  invisible: "🫥",
  paralyzed: "♿️",
  petrified: "🗿",
  poisoned: "🤢",
  prone: "🧎",
  restrained: "🪢",
  stunned: "😵‍💫",
  unconscious: "😴",
};

export function ConditionOverlay({ castMember }: { castMember: CastMember }) {
  const { conditions } = castMember;
  const icons = conditions.map((condition) => (
    <Condition
      key={condition}
      title={`${condition.charAt(0).toUpperCase()}${condition.substring(1)}`}
    >
      {Icons[condition as unknown as keyof typeof Icons]}
    </Condition>
  ));
  (Object.keys(Icons) as Array<keyof typeof Icons>).forEach(
    (condition: keyof typeof Icons) => {
      icons.push(
        <Condition
          key={condition}
          title={`${condition.charAt(0).toUpperCase()}${condition.substring(
            1
          )}`}
        >
          {Icons[condition]}
        </Condition>
      );
    }
  );
  return <Panel>{icons}</Panel>;
}

// Condition - onClick = creature remove condition
