import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../Context/AuthContext';
import { LoadingIndicator, ChannelList, Chat, Channel, Window, ChannelHeader, MessageList, MessageInput, useChatContext } from 'stream-chat-react';
import '@stream-io/stream-chat-css/dist/css/index.css';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from 'stream-chat-react';
import Button from '../Components/Button';
import Modal from "../Components/Modal/Modal.js";
import Select, { SelectInstance } from 'react-select';

function Dashboard() {
  const { user, client } = useAuth();

  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) return navigate("/"); 
  }, []);

  if (!client) return <LoadingIndicator />;

  const options = { state: true, presence: true, limit: 10 };
  const sort = { last_message_at: -1 };

  return (
    <Chat client={client}>
      <ChannelList 
        List={Channels}
        sendChannelsToList
        filters={user != null ? { members: { $in: [user.id] } } : {}} 
        sort={sort} 
        options={options} 
      />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  )
}


function Channels({ loadedChannels }) {
  const { setActiveChannel, channel: activeChannel } = useChatContext();
  const { signout, users, createNewChannel } = useAuth();

  const [isModalOpen, setModalOpen] = useState(false);

  const closeModal = () => setModalOpen(false);

  const classes_active_conversation = "bg-blue-500 text-white";
  const classes_Non_active_conversation = "bg-gray-100 hover:bg-blue-100";

  const modal_NameRef = useRef();
  const modal_UrlRef = useRef();
  const modal_members = useRef();

  const handleCreateNewConversation = (e) => {
    e.preventDefault();

    const name = modal_NameRef.current.value;
    const url = modal_UrlRef.current.value;
    const members = modal_members.current.props.value;
    
    const membersIds = members.map((m) => m.value);
    createNewChannel(name, url, membersIds);
    closeModal();
  }

  return (
    <div className='w-60 flex flex-col gap-4 m-3 h-full'>
      <Button onClick={() => setModalOpen(true)} > New Conversation </Button>
      <hr className='border-gray-500' />
      <div className='flex-1 flex flex-col'>
      {loadedChannels != null && loadedChannels.length > 0 
      ? loadedChannels.map((channel) => {
        const isActive = channel.id === activeChannel.id;
        const extraClasses = isActive ? classes_active_conversation : classes_Non_active_conversation;
        return (
          <button
            onClick={() => setActiveChannel(channel)}
            disabled={isActive}
            className={`p-4 mb-3 rounded-lg flex gap-3 items-center cursor-pointer ${extraClasses}`}
            key={channel.id}
          >
            {channel.data.image && <img src={channel.data.image} className={`w-100 h-10 rounded-full object-center object-cover`} />}
            <div className='text-ellipsis overflow-hidden whitespace-nowrap'>
              {channel.data.name ? channel.data.name : channel.id}
            </div>
          </button>
        )
      }) 
      : "No Conversations"}
      </div>
      <hr className='border-gray-500' />
      <Button onClick={() => signout()} > Logout </Button>

      {isModalOpen && <Modal closeModal={closeModal}>
        <Modal.Header>
          <Modal.Header.Title className={'text-1xl'}> New Conversation </Modal.Header.Title>
          <Modal.Header.CloseButton closeModal={closeModal} />
        </Modal.Header>
        <Modal.Body className={`flex flex-col`}>
          <label htmlFor='name'> Name </label>
          <input className={`border-2 border-gray-300 rounded my-2 p-1`} type={"text"} id="name" ref={modal_NameRef} required />
          <label htmlFor='url'> Image Url </label>
          <input className={`border-2 border-gray-300 rounded my-2 p-1`} type={"url"} id="name" ref={modal_UrlRef} required />
          <label htmlFor='members'> Members </label>
          <Select 
            ref={modal_members} 
            id={"members"} 
            required 
            isMulti 
            classNames={{container: () => "w-full"}}
            options={users && users.map((user) => {
              return { value: user.id, label: user.name || user.id };
            } )}  
          /> 
        </Modal.Body>
        <Modal.Footer>
          <Button className={'px-6'} onClick={handleCreateNewConversation}> Create </Button>
        </Modal.Footer>
      </Modal>}
    </div>
  )
}


export default Dashboard;