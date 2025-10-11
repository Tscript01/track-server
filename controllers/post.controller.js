import Post from "../models/post.model.js";

export const createPost = async (req, res, next) => {
  try {
    const { title, content, image } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: 'Title and content are required' });
    }

    const post = await Post.create({
      title,
      content,
      image,
      author: req.user._id, 
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get all blog posts
 * @route GET /api/posts
 * @access Public
 */
export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email') // show author info
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get a single blog post by ID
 * @route GET /api/posts/:id
 * @access Public
 */
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'username email'
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // increment views each time it’s opened
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update a post (only the owner can update)
 * @route PUT /api/posts/:id
 * @access Private
 */
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: 'Not authorized to update this post' });

    const updates = req.body;
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Delete a post (only the owner can delete)
 * @route DELETE /api/posts/:id
 * @access Private
 */
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this post' });

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Add comment to a post (optional)
 * @route POST /api/posts/:id/comments
 * @access Private
 */
export const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      user: req.user.userId,
      text: req.body.text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: post.comments,
    });
  } catch (err) {
    next(err);
  }
};
