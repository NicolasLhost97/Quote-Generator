import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Jest mock function
const mockFetch = jest.fn();

// Replace fetch with the mock function
global.fetch = mockFetch as any;

// Console.log checker and cleaner
let logSpy: jest.SpyInstance;

describe("<App />", () => {
  
  beforeEach(() => {
    // Resetting mock fetch implementation before each test
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ content: "Life is short", author: "Unknown" }),
    });
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });



  // Testing the default message when no quote is loaded
  test('displays default message', () => {
    render(<App />);
    expect(screen.getByText("Click on the button to get a quote")).toBeInTheDocument();
  });



  // Testing if the app can fetch and display a quote correctly
  test('fetches and displays a quote and its author', async () => {
    render(<App />);
    fireEvent.click(screen.getByText("New Quote"));

    await waitFor(() => expect(screen.getByText("❝ Life is short ❞")).toBeInTheDocument());
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });



  // Testing if the app displays an error message when we get an API error
  test('displays error when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API error'));
    
    render(<App />);
    fireEvent.click(screen.getByText("New Quote"));
  
    await waitFor(() => expect(screen.getByText("Error: API error")).toBeInTheDocument());
  });



  // If the "Quote seen recently. Fetching another..." message is shown in the console -> the application correctly avoids displaying the same quote twice.
  test('does not display the same quote twice', async () => {
    // Mock the fetch to return the same quote twice
    const duplicateQuote = { content: "Duplicate Quote", author: "Author" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => duplicateQuote
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => duplicateQuote
    });
  
    render(<App />);
    fireEvent.click(screen.getByText("New Quote"));
  
    // Wait for the quote to be displayed
    await waitFor(() => expect(screen.getByText(`❝ ${duplicateQuote.content} ❞`)).toBeInTheDocument());
    expect(screen.getByText(duplicateQuote.author)).toBeInTheDocument();
  
    // Click again to get a new quote (and it will be the same quote)
    fireEvent.click(screen.getByText("New Quote"));
  
    // Checking if the console logs the duplicate detection message
    await waitFor(() => expect(console.log).toHaveBeenCalledWith("Quote seen recently. Fetching another..."));
  });
  
});
