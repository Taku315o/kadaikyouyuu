import {request, response} from 'express';
import multer from 'multer';
import {uploadToStorage, isValidImageType, isValidFileSize} from '../services/uploadService';

// multerの設定
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
