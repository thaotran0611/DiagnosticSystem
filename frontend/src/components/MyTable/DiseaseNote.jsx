import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai'; // Import the edit and plus icons
import { Box, Button, Textarea, Flex, Text } from '@chakra-ui/react'; // Import Chakra UI components

const DiseaseNote = (props) => {
    const [editing, setEditing] = useState(false);
    const [showFullNote, setShowFullNote] = useState(false);
    const [message, setMessage] = useState(props.note || ''); // Initialize message with props.note or an empty string
    const textRef = useRef(null);

    useEffect(() => {
        // Check if the text area's scroll width is greater than its client width
        if (textRef.current) {
            const isOverflowing = textRef.current.scrollWidth > textRef.current.clientWidth;
            setShowFullNote(isOverflowing);
        }
    }, [message]);

    const handleToggleEdit = () => {
        setEditing(!editing);
    };

    const handleTakenote = (event) => {
        setMessage(event.target.value);
    };

    const handleSave = () => {
        props.onSave(props.idx, message); // Call the onSave callback function with the updated note and index
        setEditing(false); // Exit edit mode after saving
    };

    const handleCancel = () => {
        setEditing(false); // Exit edit mode without saving
        setMessage(props.note || ''); // Reset message to original note
    };

    const handleToggleNoteView = () => {
        setShowFullNote(!showFullNote); // Toggle between showing full note and truncated note
        if (!showFullNote && editing) {
            setEditing(false); // Exit edit mode if showing full note while editing
        }
    };

    return (
        <Box>
            
            {message && (
                    <Text color="gray.500" fontSize="sm" mb={1}>
                        {props.time}
                    </Text>
            )}
            <Flex align="center">
                <Box flex="1">
                    {editing || showFullNote ? (
                        <Textarea
                            w="400px" // Set the desired fixed width here
                            ref={textRef}
                            value={message}
                            onChange={handleTakenote}
                            placeholder="Write your note here!"
                            name="takenote"
                        />
                    ) : (
                        <Text ref={textRef} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {showFullNote ? message : `${message.slice(0, 50)}${message.length > 50 ? '......' : ''}`}
                        </Text>
                    )}
                </Box>
                {!editing && !showFullNote && !message && (
                    <Button onClick={() => setEditing(true)} leftIcon={<AiOutlinePlus />} ml={2}>
                        Add Note
                    </Button>
                )}
                {!editing && (message || showFullNote) && (
                    <Button onClick={handleToggleEdit} leftIcon={<AiOutlineEdit />} ml={2}>
                        Edit
                    </Button>
                )}
            </Flex>
            {!editing && (message && message.length > 50) && (
                <Flex>
                    <Text
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={handleToggleNoteView}
                    >
                        {showFullNote ? 'Show Less' : 'Show All'}
                    </Text>
                </Flex>
            )}
            {editing && (
                <Flex mt={3} justify="flex-end">
                    <Button onClick={handleCancel} mr={2}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </Flex>
            )}
        </Box>
    );
};

export default DiseaseNote;
