try {
    const token = jwt.sign({ _id: 'test_id' }, 'your_secret_key', { expiresIn: '1d' });
    console.log('Token:', token);
  } catch (err) {
    console.error('Error:', err.message);
  }