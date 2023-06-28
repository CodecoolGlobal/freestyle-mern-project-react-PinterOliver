No starter code is provided. Start from scratch!

Password salting and hashing in JavaScript password security

UserSchema.pre('save', async function () {
 const salt = await bcrypt.genSalt(10);
 this.password = await bcrypt.hash(this.password, salt);
});

await bcrypt.compare(enteredPassword, storedPassword);