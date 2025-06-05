
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Chip,
  Stack,
  Divider,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  MoreVert as MoreVertIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';

interface TemplateDisplayProps {
  template: {
    id: number;
    title: string;
    specialty: string;
    type: string;
    content: string;
    lastUsed?: string;
    usageCount?: number;
    isFavorite?: boolean;
    createdBy?: string;
    tags?: string[];
  };
  onEdit: () => void;
  onClose: () => void;
}

const TemplateDisplay: React.FC<TemplateDisplayProps> = ({
  template,
  onEdit,
  onClose
}) => {
  const [isFavorite, setIsFavorite] = useState(template.isFavorite || false);
  const [showPreview, setShowPreview] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [shareDialog, setShareDialog] = useState(false);

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(template.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy template content');
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically update the backend
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${template.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
              .content { white-space: pre-line; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${template.title}</h1>
              <p><strong>Specialty:</strong> ${template.specialty} | <strong>Type:</strong> ${template.type}</p>
            </div>
            <div class="content">${template.content}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    handleMenuClose();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([template.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${template.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    handleMenuClose();
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Header */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                color: bravoColors.primaryFlat,
                mb: 1 
              }}>
                {template.title}
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Chip 
                  label={template.specialty}
                  sx={{ 
                    backgroundColor: alpha(bravoColors.secondary, 0.1),
                    color: bravoColors.secondary,
                    fontWeight: 600
                  }}
                />
                <Chip 
                  label={template.type}
                  variant="outlined"
                  sx={{ 
                    borderColor: bravoColors.primaryFlat,
                    color: bravoColors.primaryFlat
                  }}
                />
              </Box>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                <IconButton 
                  onClick={handleToggleFavorite}
                  sx={{ 
                    color: isFavorite ? 'error.main' : 'text.secondary',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title={copySuccess ? "Copied!" : "Copy template"}>
                <IconButton 
                  onClick={handleCopyTemplate}
                  sx={{ 
                    color: copySuccess ? 'success.main' : bravoColors.primaryFlat,
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="More options">
                <IconButton 
                  onClick={handleMenuClick}
                  sx={{ color: bravoColors.primaryFlat }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Metadata */}
          <Box display="flex" alignItems="center" gap={3} mb={3}>
            {template.lastUsed && (
              <Typography variant="body2" color="text.secondary">
                Last used: {template.lastUsed}
              </Typography>
            )}
            {template.usageCount !== undefined && (
              <Typography variant="body2" color="text.secondary">
                Used {template.usageCount} times
              </Typography>
            )}
            {template.createdBy && (
              <Typography variant="body2" color="text.secondary">
                Created by: {template.createdBy}
              </Typography>
            )}
          </Box>

          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {template.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderColor: alpha(bravoColors.primaryFlat, 0.3),
                    color: bravoColors.primaryFlat,
                    '&:hover': {
                      backgroundColor: alpha(bravoColors.primaryFlat, 0.05)
                    }
                  }}
                />
              ))}
            </Stack>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={onEdit}
              sx={{
                backgroundColor: bravoColors.primaryFlat,
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: bravoColors.secondary,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(56, 126, 137, 0.4)'
                }
              }}
            >
              Edit Template
            </Button>
            
            <Button
              variant="outlined"
              startIcon={showPreview ? <VisibilityOffIcon /> : <VisibilityIcon />}
              onClick={() => setShowPreview(!showPreview)}
              sx={{
                borderColor: bravoColors.primaryFlat,
                color: bravoColors.primaryFlat,
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: bravoColors.secondary,
                  backgroundColor: alpha(bravoColors.primaryFlat, 0.05)
                }
              }}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={() => setShareDialog(true)}
              sx={{
                borderColor: bravoColors.primaryFlat,
                color: bravoColors.primaryFlat,
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: bravoColors.secondary,
                  backgroundColor: alpha(bravoColors.primaryFlat, 0.05)
                }
              }}
            >
              Share Template
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Template Content */}
      {showPreview && (
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              mb: 3,
              color: bravoColors.primaryFlat 
            }}>
              Template Content
            </Typography>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                backgroundColor: '#f8f9fa',
                borderRadius: 2,
                border: '1px solid #e9ecef',
                minHeight: 400,
                position: 'relative'
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-line', 
                  lineHeight: 1.8,
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  color: '#333'
                }}
              >
                {template.content || 'No content available for this template.'}
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      )}

      {/* Options Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <MenuItem onClick={handlePrint} sx={{ py: 1.5 }}>
          <PrintIcon sx={{ mr: 2, fontSize: 20 }} />
          Print Template
        </MenuItem>
        <MenuItem onClick={handleDownload} sx={{ py: 1.5 }}>
          <DownloadIcon sx={{ mr: 2, fontSize: 20 }} />
          Download as Text
        </MenuItem>
        <MenuItem onClick={() => setShareDialog(true)} sx={{ py: 1.5 }}>
          <ShareIcon sx={{ mr: 2, fontSize: 20 }} />
          Share Template
        </MenuItem>
      </Menu>

      {/* Share Dialog */}
      <Dialog open={shareDialog} onClose={() => setShareDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Share Template
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Share this template with your team or export it for use in other systems.
          </Typography>
          
          <TextField
            fullWidth
            label="Share URL"
            value={`${window.location.origin}/templates/${template.id}`}
            InputProps={{
              readOnly: true,
            }}
            sx={{ mb: 2 }}
          />
          
          <Stack direction="row" spacing={2}>
            <Button 
              variant="outlined" 
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/templates/${template.id}`)}
              sx={{ flex: 1 }}
            >
              Copy Link
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleDownload}
              sx={{ flex: 1 }}
            >
              Export File
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateDisplay;
