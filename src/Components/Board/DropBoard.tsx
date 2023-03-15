import { Droppable } from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { boardState } from "../../atoms";
import DragBoard from "./DragBoard";

const DropArea = styled.div<{
    isDraggingOver?: boolean;
    draggingFromThisWith?: string;
}>`
    display: flex;
    height: 400px;
    margin: 0 10px 0 10px;
    border-radius: 10px;
    background-color: ${(props) =>
        props.isDraggingOver
            ? "#4f81bd"
            : props.draggingFromThisWith
            ? "pink"
            : "inhert"};
    transition: background-color 0.3s ease;
`;
interface IDropBoardProps {
    dropBoardId: string;
}
function DropBoard({ dropBoardId }: IDropBoardProps) {
    const boards = useRecoilValue(boardState);
    return (
        <Droppable
            droppableId={dropBoardId}
            direction="horizontal"
            type={"BOARDS"}
        >
            {(boardDrop, snapshot) => (
                <DropArea
                    ref={boardDrop.innerRef}
                    {...boardDrop.droppableProps}
                    isDraggingOver={snapshot.isDraggingOver}
                    draggingFromThisWith={snapshot.draggingFromThisWith!}
                >
                    {boards[dropBoardId].map((board, index) => (
                        <DragBoard
                            key={board.dragId}
                            dropBoardId={dropBoardId}
                            dragBoardId={board.dragId}
                            index={index}
                        />
                    ))}
                    {boardDrop.placeholder}
                </DropArea>
            )}
        </Droppable>
    );
}

export default DropBoard;
