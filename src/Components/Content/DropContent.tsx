import { Droppable } from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { contentState } from "../../atoms";
import DragContent from "./DragContent";

const DropArea = styled.div<{
    isDraggingOver?: boolean;
    draggingFromThisWith?: string;
}>`
    display: flex;
    flex-direction: column;
    ::-webkit-scrollbar {
        display: none;
    }
    overflow: scroll;
    border-radius: 5px;
    background-color: ${(props) =>
        props.isDraggingOver
            ? "#4f81bd"
            : props.draggingFromThisWith
            ? "pink"
            : "inhert"};
    transition: background-color 0.3s ease;
`;
interface IDropContentProps {
    dropContentId: string;
}
function DropContent({ dropContentId }: IDropContentProps) {
    const contents = useRecoilValue(contentState);
    return (
        <Droppable droppableId={dropContentId} type={"CONTENTS"}>
            {(dropContent, snapshot) => (
                <DropArea
                    ref={dropContent.innerRef}
                    {...dropContent.droppableProps}
                    isDraggingOver={snapshot.isDraggingOver}
                    draggingFromThisWith={snapshot.draggingFromThisWith!}
                >
                    {contents[dropContentId].map((content, index) => (
                        <DragContent
                            key={content.id}
                            contents={contents[dropContentId]}
                            dropContentId={dropContentId}
                            dragContentId={content.dragId}
                            index={index}
                        />
                    ))}
                    {dropContent.placeholder}
                </DropArea>
            )}
        </Droppable>
    );
}
export default DropContent;
