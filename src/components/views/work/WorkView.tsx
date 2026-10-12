import { Artboard } from "@/components/ui/Artboard";
import { workBoards } from "@/content/work";
import { FrameCard } from "./FrameCard";
import s from "./work.module.css";

const plural = (n: number) => `${n} project${n === 1 ? "" : "s"}`;

/** Work view: one artboard per discipline, each a grid of project frames. */
export function WorkView() {
  return (
    <div className={s.view}>
      {workBoards.map((board) => (
        <Artboard key={board.id} board={board}>
          <Artboard.Header pill={board.tagline} aside={plural(board.frames.length)} />
          <Artboard.Title>{board.title}</Artboard.Title>
          <Artboard.Rule />
          <Artboard.Body className={s.grid}>
            <div className={s.gridInner} style={{ gridTemplate: board.grid }}>
              {board.frames.map((frame) => (
                <FrameCard key={frame.id} frame={frame} layout={board.frameLayout} />
              ))}
            </div>
          </Artboard.Body>
        </Artboard>
      ))}
    </div>
  );
}
