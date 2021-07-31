import React from "react";
import { Draggable } from "react-beautiful-dnd";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const Task = (props) => {
  return (
    <Draggable draggableId={props.task.id} index={props.index}>
      {(provided, snapshot) => (
        <Card
          bg={`${
            props.task.priority === "low"
              ? "success"
              : props.task.priority === "medium"
              ? "warning"
              : "danger"
          }`}
          key={props.task.id}
          text={"white"}
          className="mb-2"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          aria-roledescription="Press space bar to lift the task"
        >
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span
              style={{
                maxWidth: "inherit",
                wordWrap: "break-word",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              {props.task.title}
            </span>
            <Button
              data-taskid={props.task.id}
              onClick={props.delete}
              variant="light"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-trash-fill"
                viewBox="0 0 16 16"
              >
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
              </svg>
            </Button>
          </Card.Header>
          <Card.Body>
            <Card.Text
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 6,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                maxWidth: "100%",
                wordWrap: "break-word",
                color: "white",
                opacity: 0.9,
              }}
            >
              {props.task.description}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </Draggable>
  );
};

export default Task;
