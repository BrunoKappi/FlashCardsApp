
import { DragDropContext } from "react-beautiful-dnd";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid_v4 } from "uuid";
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Lista = [
  {
    Id: '1ID',
    Itens: [{ Id: '1IDItemOBJ1', Desc: 'Item 1 Obj 1' }, { Id: '2IDItemOBJ1', Desc: 'Item 2 Obj 1' }, { Id: '3IDItemOBJ1', Desc: 'Item 3 Obj 1' }],
    Desc: 'Obj 1'
  },
  {
    Id: '2ID',
    Itens: [{ Id: '1IDItemOBJ2', Desc: 'Item 1 Obj 2' }, { Id: '2IDItemOBJ2', Desc: 'Item 2 Obj 2' }, { Id: '3IDItemOBJ2', Desc: 'Item 3 Obj 2' }],
    Desc: 'Obj 2'
  },
  {
    Id: '3ID',
    Itens: [{ Id: '1IDItemOBJ3', Desc: 'Item 1 Obj 3' }, { Id: '2IDItemOBJ3', Desc: 'Item 2 Obj 3' }, { Id: '3IDItemOBJ3', Desc: 'Item 3 Obj 3' }],
    Desc: 'Obj 3'
  }

]

export default function Teste() {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (

    <div>

      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          
          
          
          <Droppable droppableId={'XXXX'} key={'XXXX'} >
            {(provided, snapshot) => {
              return (
                <div {...provided.droppableProps} ref={provided.innerRef}>




                  {Lista.map((OBJ, index) => {
                    return <Draggable key={OBJ.Id} draggableId={OBJ.Id} index={index} >
                      {(provided2, snapshot) => {
                        return (
                          <div ref={provided2.innerRef} {...provided2.draggableProps} {...provided2.dragHandleProps} >


                            <div className='OBJ'>




                              <Droppable droppableId={OBJ.Id + OBJ.Desc} key={OBJ.Id + OBJ.Desc} >
                                {(provided3, snapshot) => {
                                  return (
                                    <div {...provided3.droppableProps} ref={provided3.innerRef}>

                                      {
                                        OBJ.Itens.map((Item, indexItem) => {
                                          return <Draggable key={Item.Id} draggableId={Item.Id} index={indexItem} >
                                            {(provided4, snapshot) => {
                                              return (
                                                <div ref={provided4.innerRef} {...provided4.draggableProps} {...provided4.dragHandleProps} >
                                                  <div className='OBJ2'>{Item.Desc}</div>
                                                </div>
                                              )
                                            }}

                                          </Draggable>

                                        })
                                      }


                                    </div>);
                                }}
                              </Droppable>






                            </div>
                          </div>

                        )
                      }}

                    </Draggable>
                  })}


                </div>
              );
            }}
          </Droppable>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>


    </div>


  )
}
