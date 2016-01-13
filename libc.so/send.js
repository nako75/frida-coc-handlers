{
  onEnter(log, args, state)
  {
    this.sockfd = args[0];
    this.buffer = args[1];
    this.length = args[2];
    this.flags = args[3];
    if(!state.hexdump)
    {
      state.hexdump = function(pointer, length)
      {
        buf = Memory.readByteArray(pointer, length);
        arr = new Uint8Array(buf);
        hex = '';
        for(var i = 0; i < arr.length; i++)
        {
          byte = (arr[i] & 0xff).toString(16);
          byte = (byte.length === 1) ? '0' + byte : byte;
          hex += byte;
        }
        return hex;
      }
    }
    state.messageid = state.hexdump(this.buffer, 2);
    if(!state.sockfd && state.messageid == "2774")
    {
      state.sockfd = this.sockfd;
      state.events = [];
    }
    if(state.sockfd && this.sockfd.toInt32() == state.sockfd.toInt32() && this.length > 1)
    {
      header = state.hexdump(this.buffer, 7);
      buffer = state.hexdump(this.buffer, this.length.toInt32()).substring(14);
      state.events.push(
      {
        type: "send",
        messageid: state.messageid,
        header: header,
        message: state.message,
        s: state.s,
        nonce: state.nonce,
        ciphertext: state.ciphertext,
        buffer: buffer
      });
      state.message = false;
      state.s = false;
      state.nonce = false;
      state.ciphertext = false;
    }
  }
}
